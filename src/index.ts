import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';

const typeDefs = `#graphql

  type Employee {
    ID: String
    Name: String
    Status: String
}

  type Query {
    GetEmployees: [Employee]!
    CreateEmployee(Name: String, Status: String): Employee
    ChangeStatus(ID: String, Status: String): Boolean!
    RemoveEmployee(ID: String): Boolean!
}
`;

const employees = [];
var id = 0;

const validStatus = ["Working", "OnVacation", "LunchTime", "BusinessTrip"]

function checkName(name) {
  if (name === undefined || name == "") {
    console.error('Name is required')
    throw new GraphQLError('Name is required', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    })
  }
  return true
}

function checkStatus(status) {
  if (status === undefined || status == "") {
    console.error('Status is required')
    throw new GraphQLError('Status is required', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    })
  }
  if (!validStatus.includes(status)) {
    console.error('Invalid status')
    throw new GraphQLError('Invalid status', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    })
  }
  return true
}

function checkID(id) {
  if (id === undefined || id === "") {
    console.error('ID is required')
    throw new GraphQLError('ID is required', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    })
  }
  if (employees.find((emp) => emp.ID === id) === undefined) {
    console.error('This ID does not match any employee ID')
    throw new GraphQLError('This ID does not match any employee ID', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    })
  }
  return true
}

const resolvers = {
  Query: {
      GetEmployees() {
        return employees
      },

      CreateEmployee(_, args) {
        console.log('Checking arguments...')
        if (!checkName(args.Name)) {return null}
        if (!checkStatus(args.Status)) {return null}
        console.log('Executing CreateEmployee()')
        id++;
        var empId = id.toString()
        var employee =  {
            ID: empId,
            Name: args.Name,
            Status: args.Status 
        };
        employees.push(employee)
        console.log('Employee' , args.Name, 'created successfully!')
        return employee
      },

      ChangeStatus(_, args) {
        console.log('Checking arguments...')
        if (!checkStatus(args.Status)) {return false}
        if (!checkID(args.ID)) {return false}
        console.log('Executing ChangeStatus()')
        var employee = employees.find((emp) => emp.ID === args.ID)
        employee.Status = args.Status
        console.log('Status of employee', args.ID,'changed successfully to', args.Status)
        return true
      },

      RemoveEmployee(_, args) {
        console.log('Checking arguments...')
        if (!checkID(args.ID)) {return false}
        console.log('Executing RemoveEmployee()')
        var employee = employees.find((emp) => emp.ID === args.ID)
        var index = employees.indexOf(employee)
        employees.splice(index, 1)
        console.log('Employee', args.ID, 'removed successfully' )
        return true
      }
  },
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
});
  
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
  
console.log(`🚀  Server ready at: ${url}`);