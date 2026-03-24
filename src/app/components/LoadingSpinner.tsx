export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-16 h-16 border-4 border-[#f5f5f5] border-t-[#00cf40] rounded-full animate-spin"></div>
      <p className="text-xl text-[#717182]">Criando sua imagem...</p>
    </div>
  );
}
