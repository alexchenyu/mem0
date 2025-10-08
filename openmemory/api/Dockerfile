FROM python:3.12-slim

LABEL org.opencontainers.image.name="mem0/openmemory-mcp"

WORKDIR /usr/src/openmemory

# Copy and install local modified mem0 first
COPY ../../mem0 /tmp/mem0
RUN cd /tmp/mem0 && pip install -e .

# Install other requirements (excluding mem0ai)
COPY requirements.txt .
RUN grep -v "^mem0ai" requirements.txt > requirements_no_mem0.txt && \
    pip install -r requirements_no_mem0.txt

COPY config.json .
COPY . .

EXPOSE 8765
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8765"]
