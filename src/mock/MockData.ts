import { ConnectionData } from "@/types/connection";
import { DatabaseOption } from "@/types/database";
import { QueryOption } from "@/types/query";
import { Message } from "@/types/message";

export const CONNECTIONS: ConnectionData[] = [
  {
    id: "1",
    name: "Sales DB",
    type: "mysql",
    host: "localhost",
    port: 3306,
    file: null,
    date: "27/06/2025",
  },
  {
    id: "2",
    name: "Warehouse Data",
    type: "sqlite",
    host: null,
    port: null,
    file: "warehouse.db",
    date: "27/06/2025",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    type: "excel",
    host: null,
    port: null,
    file: "marketing_campaign.xlsx",
    date: "26/06/2025",
  },
  {
    id: "4",
    name: "Marketing Campaign CSV",
    type: "csv",
    host: null,
    port: null,
    file: "marketing_campaign.csv",
    date: "26/06/2025",
  },
];

export const CURRENT_CONNECTION: ConnectionData = {
  id: "mock-1",
  name: "MySQL Database",
  type: "mysql",
  host: "localhost",
  port: 3306,
  file: null,
  date: "06/07/2025",
};

export const DATABASES: DatabaseOption[] = [
  { value: "sales", label: "sales_db" },
  { value: "marketing", label: "marketing_db" },
];

export const SAVED_QUERIES: QueryOption[] = [
  {
    id: "1",
    title: "Untitled_query.sql",
    description: "The query is about list of all the customers from singapore",
    query: `SELECT * FROM customers
WHERE country = 'singapore';`,
    expanded: true,
  },
  {
    id: "2",
    title: "Sales_query.sql",
    description: "The query is about sales of the last month",
    query: `SELECT SUM(amount) as total_sales, DATE(created_at) as sale_date
FROM sales 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;`,
    expanded: false,
  },
  {
    id: "3",
    title: "Sales_query2.sql",
    description: "The query is about sales of the this month",
    query: `SELECT SUM(amount) as total_sales, product_name
FROM sales s
JOIN products p ON s.product_id = p.id
WHERE MONTH(s.created_at) = MONTH(NOW())
GROUP BY product_name
ORDER BY total_sales DESC;`,
    expanded: false,
  },
];

export const ENTITIES = {
  customers: [
    { name: "customer_id", type: "int" },
    { name: "name", type: "varchar" },
    { name: "country", type: "varchar?" },
    { name: "email", type: "varchar" },
  ],
  orders: [],
  products: [],
};


const responses = [
  "That's a great question! Let me think about that...",
  "I understand what you're asking. Here's my perspective on that topic.",
  "Thanks for sharing that with me. I'd be happy to help you with this.",
  "That's interesting! I can provide some insights on that matter.",
  "I see what you mean. Let me break this down for you.",
];

const randomResponse = responses[Math.floor(Math.random() * responses.length)];

export const AI_MESSAGE: Message = {
  id: Date.now().toString(),
  text: randomResponse,
  isUser: false,
  timestamp: new Date(),
};
