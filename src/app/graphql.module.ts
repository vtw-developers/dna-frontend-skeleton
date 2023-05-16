import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, DefaultOptions, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {onError} from '@apollo/client/link/error';
import {setContext} from '@apollo/client/link/context';

const uri = '/dna/example/graphql'; // <-- add the URL of the GraphQL server here

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
    mutate:  {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
     return {
        link: httpLink.create({ uri }),
        cache: new InMemoryCache({ addTypename: false }),
        defaultOptions
    };
}

@NgModule({
    exports: [ApolloModule],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
    ],
})
export class GraphQLModule {
}
