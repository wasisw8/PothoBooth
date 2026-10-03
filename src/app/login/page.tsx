import { signIn } from '@/lib/auth';
import { Camera } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl mix-blend-multiply filter"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl mix-blend-multiply filter"></div>
      
      <Card variant="highlighted" className="w-full max-w-md relative z-10 p-8 sm:p-12 text-center">
        <div className="mb-8 relative inline-block group">
          <div className="absolute inset-0 bg-pink-200 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300 relative z-10 mx-auto">
            <Camera className="w-12 h-12 text-white" />
          </div>
          {/* Sparkles */}
          <span className="absolute -top-4 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</span>
          <span className="absolute -bottom-2 -left-4 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>💖</span>
        </div>

        <h1 className="text-3xl font-black mb-3 text-gray-900 tracking-tight">
          Masuk ke PothoBooth
        </h1>
        <p className="text-gray-500 mb-8 font-medium">
          Yuk masuk untuk mulai foto-foto seru dan simpan riwayat jepretanmu!
        </p>

        <form action={async () => {
          'use server';
          await signIn('google', { redirectTo: '/' });
        }}>
          <Button 
            type="submit"
            size="lg" 
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Lanjutkan dengan Google
          </Button>
        </form>

        <div className="mt-8 text-sm text-gray-400">
          Dengan masuk, kamu menyetujui <a href="#" className="text-primary hover:underline">Syarat & Ketentuan</a> kami.
        </div>
      </Card>
    </div>
  );
}
