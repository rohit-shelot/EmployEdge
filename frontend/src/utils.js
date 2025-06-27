import { toast } from 'react-toastify';

export const notify = (message, type = 'info') => {
  toast[type](message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA0MEM4My4yODQzIDQwIDkwIDQ2LjcxNTcgOTAgNTVDOTAgNjMuMjg0MyA4My4yODQzIDcwIDc1IDcwQzY2LjcxNTcgNzAgNjAgNjMuMjg0MyA2MCA1NUM2MCA0Ni43MTU3IDY2LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAxMTBDMjAgMTA1LjU4MiAyMy41ODE3IDEwMiAyOCAxMDJIMTIyQzEyNi40MTggMTAyIDEzMCAxMDUuNTgyIDEzMCAxMTBDMTMwIDExNC40MTggMTI2LjQxOCAxMTggMTIyIDExOEgyOEMyMy41ODE3IDExOCAyMCAxMTQuNDE4IDIwIDExMFoiIGZpbGw9IiM5QjlCQTAiLz4KPHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cjx0ZXh0IHg9Ijc1IiB5PSIxMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
  }
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a Cloudinary URL without protocol, add https
  if (imageUrl.startsWith('//')) {
    return `https:${imageUrl}`;
  }
  
  // If it's a relative path, assume it's a Cloudinary URL and add https
  if (imageUrl.startsWith('res.cloudinary.com')) {
    return `https://${imageUrl}`;
  }
  
  return imageUrl;
};
