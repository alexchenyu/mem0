"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUserId } from "@/store/profileSlice";
import { RootState } from "@/store/store";

function UserIdListenerContent() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const currentUserId = useSelector((state: RootState) => state.profile.userId);

  useEffect(() => {
    const userIdParam = searchParams.get("user_id");
    
    if (userIdParam && userIdParam !== currentUserId) {
      console.log(`[UserIdListener] Switching user from URL param: ${userIdParam}`);
      dispatch(setUserId(userIdParam));
    }
  }, [searchParams, currentUserId, dispatch]);

  return null;
}

export function UserIdListener() {
  return (
    <Suspense fallback={null}>
      <UserIdListenerContent />
    </Suspense>
  );
}

