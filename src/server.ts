import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { Todo } from "./types.js";
import cors from "cors"

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
const app = express();
const prisma = new PrismaClient({ adapter });
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/todos", async (req, res) => {
  const { text, completed } = req.body as Todo;

    if (!text) {
        return res.status(400).send({ message: "O campo 'text' é obrigatório." });
    }

  try {
    const newTodo = await prisma.todo.create({
      data: {
        text,
        completed: completed ?? false
      },
    });
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro ao criar a tarefa." });
  }
});

app.get("/todos",async (req, res) =>{
    try {
        const listTodos = await prisma.todo.findMany({
        orderBy: {
            id: "asc"
        }
    });
    res.status(200).json(listTodos)
    } catch (error) {
        console.error(error);
    res.status(500).send({ message: "Erro ao listar todos." });
    }
});

app.delete("/todos/:id", async (req, res) => {
    const id = Number(req.params.id)

    if(isNaN(id)){
        return res.status(400).send({ message: "O ID fornecido deve ser um número válido." });
    }

    try {
        const todo = await prisma.todo.findUnique({
            where: { id }
        });

        if(!todo){
            return res.status(404).send({ message: "Todo não encontrada" });
        }

        await prisma.todo.delete({where: { id }});
        res.status(200).send({message: "Todo deletada com sucesso" });
    } catch (error) {
        console.error(error);
    res.status(500).send({ message: "Erro ao deletar todo." });
    }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
