import clientPromise from "../../../lib/mongodb"

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      try {
        const client = await clientPromise
        const db = client.db("major")

        let data = await db.collection('courses').find({}, { projection: {  } }).toArray()

        res.status(200).json(data)

      } catch (e) {
        res.status(400).json({ success: false })
      }
      break;
    case "POST":
      try {
        const client = await clientPromise
        const db = client.db("major")

        await db.collection('courses').insertOne(JSON.parse(req.body))

        res.status(200).json({ success: true })

      } catch (e) {
        console.log(e)
        res.status(400).json({ success: false })
      }
  }
}