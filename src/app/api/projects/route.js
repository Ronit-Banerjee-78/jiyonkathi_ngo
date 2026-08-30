import { fetchProjectsList, createNewProject } from '../../../../server/services/projectService.js';

export async function GET() {
  try {
    const projects = await fetchProjectsList();
    return Response.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error in projects GET:", error);
    return Response.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newProject = await createNewProject(body);
    return Response.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error("Error in projects POST:", error);
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
