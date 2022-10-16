import clientPromise from "../../../lib/mongodb"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      try {
        const client = await clientPromise
        const db = client.db("major")

        let data = await db.collection('courses').findOne({_id: ObjectId(req.query.course)}, 
                                                          {projection: {_id: 0}})
        res.status(200).json(data)
      } catch (e) {
        res.status(400).json({ success: false })
      }
      break;
    case "PUT":
      try {
        const client = await clientPromise
        const db = client.db("major")

        let data = JSON.parse(req.body)
        await db.collection('courses').updateOne({_id: ObjectId(req.query.course)}, {
          $set: data})

        res.status(200).json({ success: true })
      } catch (e) {
        console.log(e)
        res.status(400).json({ success: false })
      }
      break
    case "DELETE":
        try {
          const client = await clientPromise
          const db = client.db("major")
          await db.collection('courses').deleteOne({_id: ObjectId(req.query.course)})
          res.status(200).json({ success: true })
        } catch (e) {
          console.log(e)
          res.status(400).json({ success: false })
        }
  }
}