const TodoFilters = ({ filter, setFilter }) => {
  return (
    <div className="filters">
      {["All", "Active", "Completed"].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={filter === f ? "active" : ""}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default TodoFilters;
