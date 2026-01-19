/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    // Serve the HTML Form (The Home Page)
    if (request.method === "GET") {
      return new Response(
        `<!DOCTYPE html>
        <html>
          <body>
            <h2>It is working correctly Upload Files & Message</h2>
            <form method="POST" enctype="multipart/form-data">
              <label>Message: <input type="text" name="message" required></label><br><br>
              <label>Files: <input type="file" name="userFiles" multiple></label><br><br>
              <button type="submit">Submit</button>
            </form>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Handle the Form Submission
    if (request.method === "POST") {
      try {
		//This parses the incoming data stream. 
		// It handles the "heavy lifting" of separating the text fields from the binary file data.
        const formData = await request.formData();
        
        // Get the text message for the AI to read from the user
        const message = formData.get("message") as string;
        
        // Get all uploaded files, which will serve as the data to scour
        const files = formData.getAll("userFiles") as File[];
        
        let result = `Message received: "${message}"\n`;
        result += `Number of files: ${files.length}\n\n`;

        files.forEach((file, index) => {
          result += `File ${index + 1}: ${file.name} (${file.size} bytes)\n`;
        });

        return new Response(result);
      } catch (err) {
        return new Response("Error parsing form data", { status: 400 });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  },
} satisfies ExportedHandler<Env>;
