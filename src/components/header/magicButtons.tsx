type RatingTypes =
  | "all"
  | "safe"
  | "general"
  | "sensitive"
  | "questionable"
  | "explicit";
interface FilterParams {
  sort: { q: string; type: string; order: string };
  score: {
    value: number;
  };
  rating: RatingTypes;
}
interface MagicButtonsProps {
  filters: FilterParams;
}
function MagicButtons({ filters }: MagicButtonsProps) {
  return (
    <div className="flex gap-2">
      {filters.sort.type === "score" && (
        <button className="bg-gradient-to-tr text-sm from-rose-800 to-red-400 ring-2 ring-rose-300 text-white font-semibold rounded-full px-3  h-7">
          popular {filters.sort.order === "asc" && "old"}
        </button>
      )}
      {filters.sort.type === "updated" && filters.sort.order === "asc" && (
        <button className="bg-gradient-to-tr text-sm from-blue-800 to-indigo-400 ring-2 ring-indigo-300 text-white font-semibold rounded-full px-3  h-7">
          old
        </button>
      )}
      {filters.score.value > 0 && (
        <button className="bg-gradient-to-tr text-sm from-orange-700 to-yellow-400 ring-2 ring-orange-300 text-white font-semibold rounded-full px-3  h-7">
          score mayor a {filters.score.value} ⭐
        </button>
      )}
    </div>
  );
}
export default MagicButtons;
