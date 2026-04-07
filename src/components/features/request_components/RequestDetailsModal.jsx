import React from 'react';

const RequestDetailsModal = ({ isOpen, onClose, request, onUpdateStatus }) => {
  if (!isOpen || !request) return null;

  // 1. LOGIC: Determine the state of the request
  const isInbound = request.type?.toLowerCase() === 'inbound' || request.sentTo === 'Sta. Lucia';
  const isPending = request.status === 'PENDING';
  const isFinished = ['RECEIVED', 'COMPLETED', 'DENIED', 'CANCELLED'].includes(request.status);

  // 2. STYLING: Dynamic colors for the Status box
  const getStatusStyles = () => {
    if (request.status === 'PENDING') return 'border-[#FCE8CC] bg-[#FFF9F2]'; // Yellow
    if (['RECEIVED', 'COMPLETED'].includes(request.status)) return 'border-[#D1E7DD] bg-[#E8F5E9]'; // Green
    return 'border-[#F8D7DA] bg-[#F8D7DA]/30'; // Red for Cancelled/Denied
  };

  /* 🔌 BACKEND TEMPLATE: UPDATE STATUS (Received / Cancelled)
    ---------------------------------------------------------
    This function would be called when the user clicks 'Items Received' or 'Cancel Request'.
    
    const handleStatusUpdate = async (newStatus) => {
      try {
        const response = await fetch(`https://localhost:5001/api/requests/${request.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
           // Notify parent component to update the table state locally
           onUpdateStatus(request.id, newStatus);
           onClose();
        }
      } catch (error) {
        console.error("Database Error:", error);
      }
    };
  */

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-[#F8F9FB] rounded-2xl shadow-xl w-full max-w-[550px] p-8 relative font-montserrat">
        
        <button onClick={onClose} className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 text-2xl font-bold">✕</button>

        <h2 className="text-3xl font-extrabold text-[#333] text-center mb-8 tracking-tight">Selected Request Details</h2>

        <div className="space-y-4">
          {/* TOP ROW: PRODUCT & STATUS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
              <div className="grid grid-cols-[80px_1fr] text-sm py-1">
                <span className="text-gray-400">Perfume:</span>
                <span className="text-gray-700 font-medium">{request.perfume}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] text-sm py-1">
                <span className="text-gray-400">Quantity:</span>
                <span className="text-gray-700 font-medium">{request.qty}</span>
              </div>
            </div>

            {/* DYNAMIC STATUS BOX */}
            <div className={`border rounded-xl p-4 shadow-sm transition-colors ${getStatusStyles()}`}>
              <div className="grid grid-cols-[60px_1fr] text-sm py-1">
                <span className="text-gray-400">Status:</span>
                <span className="text-gray-700 font-bold">{request.status}</span>
              </div>
              <div className="grid grid-cols-[60px_1fr] text-sm py-1">
                <span className="text-gray-400">Type:</span>
                <span className="text-gray-700 font-medium">{isInbound ? 'Inbound' : 'Outbound'}</span>
              </div>
            </div>
          </div>

          {/* MIDDLE ROW: BRANCH INFO */}
          <div className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm relative">
            <div className="grid grid-cols-[130px_1fr] text-sm py-1">
              <span className="text-gray-400">Requested From:</span>
              <span className="text-gray-700 font-medium">{request.requestedFrom}</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] text-sm py-1">
              <span className="text-gray-400">Sent To:</span>
              <span className="text-gray-700 font-medium">{request.sentTo}</span>
            </div>
            <div className="absolute top-4 right-4 text-sm">
              <span className="text-gray-400 mr-2">ID:</span>
              <span className="text-gray-700 font-medium">{request.id}</span>
            </div>
          </div>

          {/* BOTTOM ROW: DATE/TIME */}
          <div className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Date and Time Requested:</span>
              <span className="text-gray-700 font-medium">{request.date} {request.time}</span>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#E5D5C1] text-gray-700 rounded-md hover:bg-[#d4c2ab] font-medium text-sm transition-colors"
          >
            ‹ Go back
          </button>

          {/* CONDITIONAL ACTION BUTTONS: Only show if PENDING */}
          {!isFinished && (
            <>
              {isInbound ? (
                <button 
                  className="px-6 py-2 border-2 border-[#94BE9F] text-[#94BE9F] rounded-md hover:bg-green-50 font-bold text-sm flex items-center gap-2 transition-colors"
                  /* onClick={() => handleStatusUpdate('RECEIVED')} */
                >
                  ✓ Items Received
                </button>
              ) : (
                <button 
                  className="px-6 py-2 border-2 border-[#902A3C] text-[#902A3C] rounded-md hover:bg-red-50 font-bold text-sm flex items-center gap-2 transition-colors"
                  /* onClick={() => handleStatusUpdate('CANCELLED')} */
                >
                  ✕ Cancel Request
                </button>
              )}
            </>
          )}

          {/* IF FINISHED: Show a small label or just leave the "Go back" button */}
          {isFinished && (
            <span className="text-gray-400 text-xs italic">This request is finalized.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;