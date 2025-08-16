
export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Federal Grants Database</h1>
      <p className="text-xl mb-8">Welcome to the Federal Grants Database</p>
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
          <p>This is a simplified version to test the deployment.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Navigation</h2>
          <p>Visit /test to see if routing is working.</p>
        </div>
      </div>
    </div>
  )
}
