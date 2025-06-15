// File: src/pages/HomePage.jsx

function HomePage() {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 p-4 hidden md:block overflow-y-auto border-r border-base-300">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <ul className="space-y-2">
          {["@Alice", "@Bob", "@Charlie"].map((user) => (
            <li
              key={user}
              className="p-2 rounded bg-base-100 cursor-pointer hover:bg-base-300 transition"
            >
              {user}
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Section */}
      <main className="flex-1 flex flex-col bg-base-100">
        <div className="p-4 border-b border-base-300">
          <h2 className="text-lg font-medium">Chat with @Alice</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="chat chat-start">
            <div className="chat-bubble">Hey Alice!</div>
          </div>
          <div className="chat chat-end">
            <div className="chat-bubble">Hi! How's it going?</div>
          </div>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="p-4 border-t border-base-300 flex gap-2"
        >
          <input
            type="text"
            placeholder="Type a message"
            className="input input-bordered flex-1"
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </main>
    </div>
  );
}

export default HomePage;
