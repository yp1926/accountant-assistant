import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase
    .from("test")
    .select("*");

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Supabase Connection Test
      </h1>

      {error && (
        <p className="text-red-500">
          Error: {error.message}
        </p>
      )}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}