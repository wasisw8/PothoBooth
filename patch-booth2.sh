# Remove the conditional rendering around CameraView
sed -i '' 's/{!capturedPhoto && (//' src/app/booth/page.tsx
sed -i '' 's/)}//' src/app/booth/page.tsx

# Add key and retakeSlot props
sed -i '' 's/<CameraView/<CameraView key={sessionKey} retakeSlot={retakeSlot}/' src/app/booth/page.tsx

# Change wrapper class to use hidden
sed -i '' 's/scale-95 opacity-50 blur-sm pointer-events-none/hidden opacity-0 scale-95 pointer-events-none/' src/app/booth/page.tsx
sed -i '' 's/scale-100 opacity-100/block opacity-100 scale-100/' src/app/booth/page.tsx

# Update PhotoPreview props
sed -i '' 's/imageData={capturedPhoto}/imageData={capturedPhoto}\n          mode={mode}\n          onRetakeSlot={handleRetake}/' src/app/booth/page.tsx
sed -i '' 's/onDiscard={() => setCapturedPhoto(null)}/onDiscard={handleDiscard}/' src/app/booth/page.tsx

