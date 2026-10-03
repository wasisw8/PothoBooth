import * as fs from 'fs'

const file = 'src/components/booth/CameraView.tsx'
let content = fs.readFileSync(file, 'utf8')

// The file got truncated because endIndex was -1 in the last script.
// I need to append the missing controls section.

const controls = `
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={switchCamera}
          className="p-4 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all text-white border border-white/30"
          title="Tukar Kamera"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button
          onClick={() => setMirrored(!mirrored)}
          className={\`p-4 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all text-white border border-white/30 \${mirrored ? 'bg-primary' : ''}\`}
          title="Balikkan Gambar (Mirror)"
        >
          <FlipHorizontal className="w-6 h-6" />
        </button>
        <button
          onClick={startCountdown}
          disabled={countdown !== null}
          className="p-4 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg rounded-full backdrop-blur-md transition-all text-white border-2 border-white disabled:opacity-50"
          title="Ambil Foto"
        >
          <Camera className="w-8 h-8" />
        </button>
      </div>
    </div>
  )
}
`

const lastPart = content.slice(content.length - 10)
if (!lastPart.includes('</div>')) {
  content += controls
  fs.writeFileSync(file, content)
  console.log('Fixed!')
} else {
  console.log('Needs different fix')
}

