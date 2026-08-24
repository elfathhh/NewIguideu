import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function SearchPagination({
    currentPage,
    totalPages,
    onPageChange,
}: SearchPaginationProps) {
    if (totalPages <= 1) return null;

    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(
                    1,
                    '...',
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages,
                );
            } else {
                pages.push(
                    1,
                    '...',
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    '...',
                    totalPages,
                );
            }
        }

        return pages;
    };

    return (
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <div className="text-sm text-[#8f9097]">
                Halaman{' '}
                <span className="font-semibold text-white">{currentPage}</span>{' '}
                dari{' '}
                <span className="font-semibold text-white">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
                {/* Prev Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#c6c6ce] transition-colors hover:border-[#e9c176]/40 hover:text-[#e9c176] focus:ring-2 focus:ring-[#e9c176]/50 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page Numbers */}
                {generatePageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex h-10 w-10 items-center justify-center text-[#8f9097]"
                            >
                                ...
                            </span>
                        );
                    }

                    const isCurrent = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl px-2 text-sm transition-colors focus:ring-2 focus:ring-[#e9c176]/50 focus:outline-none ${
                                isCurrent
                                    ? 'border border-[#e9c176] bg-[#e9c176] font-bold text-[#0D182E]'
                                    : 'border border-white/10 bg-white/5 text-[#c6c6ce] hover:border-[#e9c176]/40 hover:text-[#e9c176]'
                            }`}
                            aria-current={isCurrent ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#c6c6ce] transition-colors hover:border-[#e9c176]/40 hover:text-[#e9c176] focus:ring-2 focus:ring-[#e9c176]/50 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
