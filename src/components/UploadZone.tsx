import type {
  ChangeEvent,
  DragEvent,
} from 'react'

interface UploadZoneProps {
  hasSelectedFile: boolean
  isDragging: boolean
  onFileSelection: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void
  onDragOver: (
    event: DragEvent<HTMLLabelElement>,
  ) => void
  onDragLeave: (
    event: DragEvent<HTMLLabelElement>,
  ) => void
  onDrop: (
    event: DragEvent<HTMLLabelElement>,
  ) => void
}

export function UploadZone({
  hasSelectedFile,
  isDragging,
  onFileSelection,
  onDragOver,
  onDragLeave,
  onDrop,
}: UploadZoneProps) {
  return (
    <>
      <label
        className={`upload-zone${
          isDragging ? ' upload-zone--dragging' : ''
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <span
          className="upload-zone__icon"
          aria-hidden="true"
        >
          ↑
        </span>

        <span className="upload-zone__title">
          {hasSelectedFile
            ? 'Choose another file'
            : 'Upload Audio'}
        </span>

        <span className="upload-zone__instruction">
          Click to browse or drag and drop your file here
        </span>

        <input
          type="file"
          accept=".wav,.mp3,.flac,.ogg,.m4a,audio/*"
          onChange={onFileSelection}
        />
      </label>

      <p className="supported-formats">
        WAV <span>·</span> MP3 <span>·</span> FLAC{' '}
        <span>·</span> OGG <span>·</span> M4A
      </p>
    </>
  )
}