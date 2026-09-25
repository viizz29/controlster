import type { DataNode } from "@/api/data-node-apis";

import ConfirmModal from "@/components/modals/confirmation-modal";




interface NoteDeletionModalProps {
  dataNode: DataNode | null;
  onSubmit: (dataNode: DataNode) => void;
  onCancel: () => void;
}


export default function NoteDeletionModal({ dataNode, onCancel, onSubmit }: NoteDeletionModalProps) {


  return (

    dataNode &&
    <ConfirmModal open={dataNode !== null} message={`Are you sure you want to delete this note '${dataNode.note}'`} onConfirm={() => onSubmit(dataNode)} onCancel={onCancel} />

  );
}