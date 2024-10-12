export async function POST(request: Request) {
  const body = await request.json();
  const { type, data } = body;

  if (type === "video.asset.ready") {
    // await saveAssetToDatabase(data);
    console.log(data);
    console.log(data);
    console.log(data);
    console.log(data);
    console.log(data);
  } else {
    /* handle other event types */
  }
  return Response.json({ message: "ok" });
}
