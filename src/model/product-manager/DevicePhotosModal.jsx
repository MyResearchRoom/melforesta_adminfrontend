import { IoCloseOutline } from "react-icons/io5";

function DevicePhotosModal({ isOpen, onClose, device, selectedIndex, setSelectedIndex }) {
  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl px-6 py-6 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-gray-600 hover:text-gray-900"
        >
          <IoCloseOutline size={28} />
        </button>

        <div className="rounded-xl overflow-hidden shadow-md border bg-white">
            {device.issue_photos[selectedIndex].mediaContentType.startsWith("video/") ? (
            <video
                src={device.issue_photos[selectedIndex].media}
                controls
                className="w-full h-[60vh] object-cover transition-all duration-300"
            />
            ) : (
                <img
                    src={device.issue_photos[selectedIndex].media}
                    alt={`Main view ${selectedIndex + 1}`}
                    className="w-full h-[60vh] object-cover transition-all duration-300"
                />
            )}
        </div>

 
        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          {device.issue_photos.map((photo, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
            selectedIndex === index ? "border-[#A63F40]" : "border-transparent"
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            {photo.mediaContentType.startsWith("video/") ? (
            <video
              src={photo.media}
              className="w-20 h-20 object-cover hover:opacity-80 transition"
              muted
            />
            ) : (
            <img
              src={photo.media}
              alt={`Thumbnail ${index + 1}`}
              className="w-20 h-20 object-cover hover:opacity-80 transition"
            />
            )}
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DevicePhotosModal;
