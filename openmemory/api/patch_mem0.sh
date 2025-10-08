#!/bin/bash
# Patch mem0 to remove dimensions parameter for litellm compatibility
#
# Background:
# - litellm doesn't support the 'dimensions' parameter that OpenAI's embedding API uses
# - mem0's OpenAIEmbedding class always passes dimensions parameter
# - This causes 400 errors when using litellm as a proxy
#
# Solution:
# - Remove the dimensions parameter from the embedding API call
# - Add chat_template_kwargs support for GLM-4.6-FP8
# - Vector store dimensions are configured separately via EMBEDDING_MODEL_DIMS

set -e

echo "========================================="
echo "Patching mem0 for litellm compatibility"
echo "========================================="

# Find the mem0 installation path
MEM0_PATH=$(python -c "import mem0; import os; print(os.path.dirname(mem0.__file__))")

echo "Found mem0 at: $MEM0_PATH"

# Patch embeddings file
python3 << 'PYTHON_SCRIPT'
import sys
import os

# Patch embeddings file
print("\n[1/2] Patching embeddings...")
embedding_file = None
for path in [
    '/usr/local/lib/python3.12/site-packages/mem0/embeddings/openai.py',
    '/usr/local/lib/python3.11/site-packages/mem0/embeddings/openai.py',
]:
    if os.path.exists(path):
        embedding_file = path
        break

if not embedding_file:
    print("ERROR: Could not find mem0 embeddings/openai.py")
    sys.exit(1)

with open(embedding_file, 'r') as f:
    content = f.read()

# Remove dimensions parameter
old_line = 'self.client.embeddings.create(input=[text], model=self.config.model, dimensions=self.config.embedding_dims)'
new_line = 'self.client.embeddings.create(input=[text], model=self.config.model)'

if old_line in content:
    content = content.replace(old_line, new_line)
    with open(embedding_file, 'w') as f:
        f.write(content)
    print(f"✓ Removed dimensions parameter from {embedding_file}")
else:
    print(f"⚠ dimensions parameter not found (may be already patched)")

# Patch LLM file
print("\n[2/2] Patching LLM for chat_template_kwargs...")
llm_file = embedding_file.replace('/embeddings/openai.py', '/llms/openai.py')

if not os.path.exists(llm_file):
    print(f"ERROR: Could not find {llm_file}")
    sys.exit(1)

with open(llm_file, 'r') as f:
    llm_content = f.read()

# Add chat_template_kwargs support
search_text = '        if response_format:\n            params["response_format"] = response_format'
replacement_text = '''        # Add chat_template_kwargs for GLM-4.6-FP8 to disable thinking mode
        import os
        if os.getenv("DISABLE_THINKING", "false").lower() == "true":
            params["extra_body"] = {
                "chat_template_kwargs": {
                    "enable_thinking": False
                }
            }

        if response_format:
            params["response_format"] = response_format'''

if search_text in llm_content:
    llm_content = llm_content.replace(search_text, replacement_text)
    with open(llm_file, 'w') as f:
        f.write(llm_content)
    print(f"✓ Added chat_template_kwargs support to {llm_file}")
else:
    print(f"⚠ chat_template_kwargs section not found (may be already patched)")

print("\n✓ All patches completed successfully!")
PYTHON_SCRIPT

echo "========================================="
echo "Patch complete!"
echo "========================================="
