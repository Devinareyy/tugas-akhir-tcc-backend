import express, { Express, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

const prisma = new PrismaClient()

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.get('/notes', async (req: Request, res: Response) => {
  const allNotes = await prisma.note.findMany({
    orderBy: {
       created_at: 'desc',
    },
  })

  res.json({
    status: "SUCCESS",
    notes: allNotes,
  })
})

app.get('/notes/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const noteId = Number(id)

  if (isNaN(noteId)) {
    return res.status(500).json({
      status: "ERROR"
    })
  }

  const note = await prisma.note.findFirst({
    where: {
      id: noteId
    }
  })

  if (!note) {
    return res.status(404).json({
      status: "ERROR",
      note: null,
    })
  }

  res.json({
    status: "SUCCESS",
    note: note,
  })
})

app.delete('/notes/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const noteId = Number(id)

  if (isNaN(noteId)) {
    return res.status(500).json({
      status: "ERROR"
    })
  }

  const note = await prisma.note.findFirst({
    where: {
      id: noteId
    }
  })

  if (!note) {
    return res.status(404).json({
      status: "ERROR",
    })
  }

  await prisma.note.delete({
    where: {
      id: noteId,
    }
  })

  res.json({
    status: "SUCCESS",
  })
})

app.put('/notes/:id', async (req: Request, res: Response) => {
  const { title, content } = req.body
  const { id } = req.params
  const noteId = Number(id)

  if (isNaN(noteId)) {
    return res.status(500).json({
      status: "ERROR"
    })
  }

  if (!title || !content) {
    return res.status(500).json({
      status: "ERROR"
    })
  }

  const note = await prisma.note.findFirst({
    where: {
      id: noteId
    }
  })

  if (!note) {
    return res.status(404).json({
      status: "ERROR",
    })
  }

  const newNote = await prisma.note.update({
    data: {
      title: title,
      content: content,
    },
    where: {
      id: noteId,
    }
  })

  return res.json({
    status: "SUCCESS",
    newNote,
  })
})

app.post('/notes', async (req: Request, res: Response) => {
  const { title, content } = req.body
  if(!title || !content) {
    return res.status(500).json({
      status: "ERROR"
    })
  }

  const note = await prisma.note.create({
    data: {
      title: title,
      content: content,
    }
  })

  return res.json({
    status: "SUCCESS",
    note,
  })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})