// NotImplemented.jsx


const NotImplemented = ({ featureName }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 border border-gray-300 rounded-md">
      <h2 className="text-xl font-semibold text-blue-600">
        🚧 Feature Not Implemented
      </h2>
      <p className="text-gray-700 mt-2">
        The <strong>{featureName || "requested feature"}</strong> is not available yet.
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Coming soon.
      </p>
    </div>
  );
};

export default NotImplemented;
