import {
  BarChart3Icon,
  TrendingUpIcon,
  BookOpenIcon,
  ClockIcon,
  CalendarIcon,
  StarIcon,
} from "lucide-react";

const StatsPanel = ({ notes, searchQuery }) => {
  const filteredNotes = searchQuery
    ? notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  const totalNotes = filteredNotes.length;
  const totalWords = filteredNotes.reduce(
    (acc, note) => acc + note.content.split(" ").length,
    0
  );
  const totalChars = filteredNotes.reduce(
    (acc, note) => acc + note.content.length,
    0
  );
  const avgWordsPerNote =
    totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;
  const totalReadingTime = Math.ceil(totalWords / 200); // 200 words per minute

  // Get notes from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentNotes = filteredNotes.filter(
    (note) => new Date(note.createdAt) >= sevenDaysAgo
  );

  // Get most productive day
  const notesPerDay = {};
  filteredNotes.forEach((note) => {
    const day = new Date(note.createdAt).toDateString();
    notesPerDay[day] = (notesPerDay[day] || 0) + 1;
  });
  const mostProductiveDay = Object.entries(notesPerDay).reduce(
    (max, [day, count]) => (count > max.count ? { day, count } : max),
    { day: "None", count: 0 }
  );

  // Longest note
  const longestNote = filteredNotes.reduce(
    (longest, note) =>
      note.content.length > longest.length
        ? { title: note.title, length: note.content.length }
        : longest,
    { title: "None", length: 0 }
  );

  if (totalNotes === 0) {
    return null;
  }

  return (
    <div className="bg-base-100/60 backdrop-blur-sm rounded-2xl p-6 border border-base-content/10 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 text-primary rounded-xl">
          <BarChart3Icon className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-base-content">
            Your Writing Stats
          </h3>
          <p className="text-sm text-base-content/60">
            Insights from your notes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Notes */}
        <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10">
          <BookOpenIcon className="size-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary">{totalNotes}</div>
          <div className="text-xs text-base-content/60">Notes</div>
        </div>

        {/* Total Words */}
        <div className="text-center p-4 bg-secondary/5 rounded-xl border border-secondary/10">
          <TrendingUpIcon className="size-8 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold text-secondary">
            {totalWords.toLocaleString()}
          </div>
          <div className="text-xs text-base-content/60">Words</div>
        </div>

        {/* Reading Time */}
        <div className="text-center p-4 bg-accent/5 rounded-xl border border-accent/10">
          <ClockIcon className="size-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-accent">
            {totalReadingTime}
          </div>
          <div className="text-xs text-base-content/60">Min Read</div>
        </div>

        {/* Recent Notes */}
        <div className="text-center p-4 bg-success/5 rounded-xl border border-success/10">
          <CalendarIcon className="size-8 text-success mx-auto mb-2" />
          <div className="text-2xl font-bold text-success">
            {recentNotes.length}
          </div>
          <div className="text-xs text-base-content/60">This Week</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Insights */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base-content flex items-center gap-2">
            <StarIcon className="size-4 text-warning" />
            Quick Insights
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-base-200/50 rounded-lg">
              <span className="text-base-content/70">Avg words per note:</span>
              <span className="font-medium text-base-content">
                {avgWordsPerNote}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-base-200/50 rounded-lg">
              <span className="text-base-content/70">Total characters:</span>
              <span className="font-medium text-base-content">
                {totalChars.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-base-200/50 rounded-lg">
              <span className="text-base-content/70">Most productive day:</span>
              <span className="font-medium text-base-content">
                {mostProductiveDay.count > 0
                  ? `${new Date(mostProductiveDay.day).toLocaleDateString(
                      "en-US",
                      { weekday: "short" }
                    )} (${mostProductiveDay.count})`
                  : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base-content flex items-center gap-2">
            <TrendingUpIcon className="size-4 text-info" />
            Achievements
          </h4>
          <div className="space-y-2 text-sm">
            {totalNotes >= 10 && (
              <div className="flex items-center gap-2 p-2 bg-success/10 border border-success/20 rounded-lg">
                <span className="text-lg">📚</span>
                <span className="text-success font-medium">
                  Prolific Writer
                </span>
              </div>
            )}
            {totalWords >= 1000 && (
              <div className="flex items-center gap-2 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <span className="text-lg">✍️</span>
                <span className="text-primary font-medium">Word Master</span>
              </div>
            )}
            {recentNotes.length >= 3 && (
              <div className="flex items-center gap-2 p-2 bg-warning/10 border border-warning/20 rounded-lg">
                <span className="text-lg">🔥</span>
                <span className="text-warning font-medium">On Fire</span>
              </div>
            )}
            {longestNote.length > 500 && (
              <div className="flex items-center gap-2 p-2 bg-info/10 border border-info/20 rounded-lg">
                <span className="text-lg">📖</span>
                <span className="text-info font-medium">Deep Thinker</span>
              </div>
            )}
            {totalNotes < 5 && (
              <div className="flex items-center gap-2 p-2 bg-base-200/50 rounded-lg">
                <span className="text-lg">🌱</span>
                <span className="text-base-content/70 font-medium">
                  Getting Started
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Longest Note Preview */}
      {longestNote.length > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <BookOpenIcon className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Longest Note
            </span>
          </div>
          <div className="text-sm text-base-content/70">
            "{longestNote.title}" ({longestNote.length} characters)
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;
