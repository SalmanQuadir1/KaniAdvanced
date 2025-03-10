import React, { useState } from 'react';

const ResizeModal = ({ image, onSave, onClose }) => {
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(800);

    const handleSave = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        const img = new Image();
        img.src = image.url;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                const resizedImage = new File([blob], image.file.name, { type: image.file.type });
                onSave({ ...image, file: resizedImage, url: URL.createObjectURL(resizedImage) });
                onClose();
            }, image.file.type);
        };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl mb-4">Resize Image</h2>
                <div className="mb-4">
                    <label className="block mb-2">Width:</label>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        className="border p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Height:</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        className="border p-2 w-full"
                    />
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResizeModal;