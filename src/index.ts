import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql

  type Employee {
    ID: String
    Name: String
    Status: String
}

  type Query {
    GetEmployees: [Employee]!
    CreateEmployee(Name: String!, Status: String!): Employee
    ChangeStatus(ID: String!, Status: String!): Boolean!
    RemoveEmployee(ID: String!): Boolean!
  }
`;

const employees = [{
    ID: "bla",
    Name:"Niv",
    Status:"Working"
}];

  const validStatus = ["Working", "OnVacation", "LunchTime", "BusinessTrip"]

  const resolvers = {
    Query: {
        GetEmployees() {
            return employees
        },

        CreateEmployee(_, args) {
            if (!validStatus.includes(args.Status)) { return null; }
            var id = Date.now().toString(36) + Math.random().toString(36)
            var employee =  {
                ID: id,
                Name: args.Name,
                Status: args.Status 
            };
            employees.push(employee)
            return employee
        },

        ChangeStatus(_, args) {
            if (!validStatus.includes(args.Status)) {return false;}
            var employee = employees.find((emp) => emp.ID === args.ID)
            if (employee) { employee.Status = args.Status; }
            return true
        },

        RemoveEmployee(_, args) {
            var employee = employees.find((emp) => emp.ID === args.ID)
            if (!employee) {return false;}
            var index = employees.indexOf(employee)
            employees.splice(index, 1)
            return true;
        }
    },
  };

  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);