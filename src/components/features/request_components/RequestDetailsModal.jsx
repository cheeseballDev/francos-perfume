import { Button } from '@/components/ui/button';

const RequestDetailsModal = ({ isOpen, onClose, request, onUpdateStatus }) => {
  if (!isOpen || !request) return null;

  // 1. LOGIC: Determine the state of the request
  const isInbound = request.type?.toLowerCase() === 'inbound' || request.sentTo === 'Sta. Lucia';
  const isPending = request.status === 'PENDING';
  const isFinished = ['RECEIVED', 'COMPLETED', 'DENIED', 'CANCELLED'].includes(request.status);

  // 2. STYLING: Dynamic colors for the Status box using theme tokens
  const getStatusStyles = () => {
    if (request.status === 'PENDING') return 'border-custom-yellow/40 bg-custom-yellow/10';
    if (['RECEIVED', 'COMPLETED'].includes(request.status)) return 'border-custom-green/40 bg-custom-green/10';
    return 'border-custom-red/40 bg-custom-red/10'; // Cancelled / Denied
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
      <div className="bg-custom-white rounded-2xl shadow-xl w-full max-w-137.5 p-8 relative font-montserrat">

        <button onClick={onClose} className="absolute top-4 right-5 text-custom-gray hover:text-custom-black text-2xl font-bold">✕</button>

        <h2 className="text-3xl font-extrabold text-custom-black text-center mb-8 tracking-tight">Selected Request Details</h2>

        <div className="space-y-4">
          {/* TOP ROW: PRODUCT & STATUS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-custom-gray-2 rounded-xl p-4 bg-white shadow-sm">
              <div className="grid grid-cols-[80px_1fr] text-sm py-1">
                <span className="text-custom-gray">Perfume:</span>
                <span className="text-custom-black font-medium">{request.perfume}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] text-sm py-1">
                <span className="text-custom-gray">Quantity:</span>
                <span className="text-custom-black font-medium">{request.qty}</span>
              </div>
            </div>

            {/* DYNAMIC STATUS BOX */}
            <div className={`border rounded-xl p-4 shadow-sm transition-colors ${getStatusStyles()}`}>
              <div className="grid grid-cols-[60px_1fr] text-sm py-1">
                <span className="text-custom-gray">Status:</span>
                <span className="text-custom-black font-bold">{request.status}</span>
              </div>
              <div className="grid grid-cols-[60px_1fr] text-sm py-1">
                <span className="text-custom-gray">Type:</span>
                <span className="text-custom-black font-medium">{isInbound ? 'Inbound' : 'Outbound'}</span>
              </div>
            </div>
          </div>

          {/* MIDDLE ROW: BRANCH INFO */}
          <div className="border border-custom-gray-2 rounded-xl p-4 bg-white shadow-sm relative">
            <div className="grid grid-cols-[130px_1fr] text-sm py-1">
              <span className="text-custom-gray">Requested From:</span>
              <span className="text-custom-black font-medium">{request.requestedFrom}</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] text-sm py-1">
              <span className="text-custom-gray">Sent To:</span>
              <span className="text-custom-black font-medium">{request.sentTo}</span>
            </div>
            <div className="absolute top-4 right-4 text-sm">
              <span className="text-custom-gray mr-2">ID:</span>
              <span className="text-custom-black font-medium">{request.id}</span>
            </div>
          </div>

          {/* BOTTOM ROW: DATE/TIME */}
          <div className="border border-custom-gray-2 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="text-custom-gray">Date and Time Requested:</span>
              <span className="text-custom-black font-medium">{request.date} {request.time}</span>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="primary" onClick={onClose}>‹ Go back</Button>

          {/* CONDITIONAL ACTION BUTTONS: Only show if not finalized */}
          {!isFinished && (
            <>
              {isInbound ? (
                <Button variant="success-outline" /* onClick={() => handleStatusUpdate('RECEIVED')} */>
                  ✓ Items Received
                </Button>
              ) : (
                <Button variant="destructive-outline" /* onClick={() => handleStatusUpdate('CANCELLED')} */>
                  ✕ Cancel Request
                </Button>
              )}
            </>
          )}

          {/* IF FINISHED: Show a small label or just leave the "Go back" button */}
          {isFinished && (
            <span className="text-custom-gray text-xs italic">This request is finalized.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
