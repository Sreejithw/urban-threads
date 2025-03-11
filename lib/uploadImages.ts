import {
    generateUploadButton,
    generateUploadDropzone,
  } from '@uploadthing/react';
  import type { OurFileRouter } from '@/app/api/uploadthing/core';
  
  export const UploadImages = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();