# RxDB Repository

RxDB is a real time Database for JavaScript Applications. You can read more about it [here](https://rxdb.info/).
The abstract `Repository` class offers basic functionalities to **insert**, **update**, **get** and **remove** into the RxDB.

## How to use

The `Repository` uses the takes a `Model`, a `BaseQuery` and a `dbConnector`. The lowercase **model name** is the corresponding **collection name** in the database provided by the dbConnector.

The `BaseQuery` is a function which creates a [pouchdb mango query](https://pouchdb.com/guides/mango-queries.html) object with the **key** attributes to uniquely identify an entity in the database.

## Example with custom function

    @injectable()  
    export class SubRecommendationRepo extends Repository<SubRecommendation> {  
      constructor(@inject(CastDBConnector) dbConnector: DBConnector) {  
        super(SubRecommendation, CastBaseQuery.parentId, dbConnector);  
      }  
      
      public async removeAllForRecommendationId(
	      projectId: string, recommendationId: string
	  ): Promise<boolean> {  
          const collection = await this.getCollection();  
		  return collection  
            .find()  
            .where('projectId')  
            .eq(projectId)  
            .where('parentId')  
            .eq(recommendationId)  
            .remove()  
            .then(() => true);  
      }  
    }

    public static parentId<T extends ProjectId & ParentIdString & IdString>
      ({ projectId, parentId, id }: T): EqSelector {  
        return { selector: { 
          projectId: { $eq: projectId }, 
          parentId: { $eq: parentId }, 
          id: { $eq: id } 
        }};  
    }
