import * as fs from 'fs'

const file = 'src/components/booth/CameraView.tsx'
let content = fs.readFileSync(file, 'utf8')

const grid6UI = `
      {mode === 'grid6' ? (
        <div className="relative w-full max-w-md mx-auto aspect-[682/1024] bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Slots */}
          {[0, 1, 2, 3, 4, 5].map(index => {
            const col = index % 2
            const row = Math.floor(index / 2)
            const left = col === 0 ? '6.6%' : '52.1%'
            const top = row === 0 ? '9.3%' : row === 1 ? '33.7%' : '58.1%'
            const width = '41.1%'
            const height = '21.5%'
            
            const isCurrent = retakeSlot !== null && retakeSlot !== undefined 
              ? retakeSlot === index 
              : stripPhotos.length === index

            return (
              <div 
                key={index}
                className="absolute bg-gray-100 overflow-hidden"
                style={{ left, top, width, height }}
              >
                {stripPhotos[index] && !isCurrent ? (
                  <img src={stripPhotos[index]} className="w-full h-full object-cover" />
                ) : isCurrent ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored={mirrored}
                    videoConstraints={{ facingMode, width: 640, height: 480 }}
                    className={\`w-full h-full object-cover \${currentFilter} \${mirrored ? 'scale-x-[-1]' : ''}\`}
                  />
                ) : null}
              </div>
            )
          })}

          {/* Template Overlay */}
          {templateUrl && (
            <img
              src={templateUrl}
              alt="Template overlay"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-20"
            />
          )}

          {/* Flash & Countdown for Grid6 */}
          {showFlash && (
            <div className="absolute inset-0 bg-white animate-flash pointer-events-none z-30" />
          )}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40">
              <span className="text-white text-9xl font-black animate-countdown drop-shadow-lg">
                {countdown}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={mirrored}
            videoConstraints={{ facingMode, width: 640, height: 480 }}
            className={\`w-full h-auto block \${currentFilter} \${mirrored ? 'scale-x-[-1]' : ''}\`}
          />
          {templateUrl && mode === 'single' && (
            <img
              src={templateUrl}
              alt="Template overlay"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
            />
          )}
          {showFlash && (
            <div className="absolute inset-0 bg-white animate-flash pointer-events-none z-20" />
          )}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-30">
              <span className="text-white text-9xl font-black animate-countdown drop-shadow-lg">
                {countdown}
              </span>
            </div>
          )}
          {mode === 'strip' && (
            <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm z-10 shadow-md">
              📸 {stripPhotos.length} / 4
            </div>
          )}
        </div>
      )}
`

// We need to replace the content inside the main return wrapper
// It starts with <div className="relative w-full max-w-2xl mx-auto">
// and ends right before <div className="mt-6 flex justify-center gap-4">

const startSearch = '<div className="relative w-full max-w-2xl mx-auto">'
const endSearch = '<div className="mt-6 flex justify-center gap-4">'

const startIndex = content.indexOf(startSearch) + startSearch.length
const endIndex = content.indexOf(endSearch)

const newContent = content.slice(0, startIndex) + '\n' + grid6UI + '\n      ' + content.slice(endIndex)
fs.writeFileSync(file, newContent)
