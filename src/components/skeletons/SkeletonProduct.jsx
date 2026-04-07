import React from 'react';

export default function SkeletonProduct() {
  return (
    <div className="w-full h-full animate-pulse flex flex-col gap-4">
      {/* Image Skeleton */}
      <div className="aspect-[4/5] w-full bg-gray-200 rounded-[2.5rem]"></div>
      
      {/* Content Skeleton */}
      <div className="space-y-3 px-2">
        <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
        <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded-full w-1/4 mt-4"></div>
      </div>
    </div>
  );
}
