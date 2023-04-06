import type { IProfile } from './profile';
import {
  getRedisOmClient,
  getNodeRedisClient,
  RedisEntity,
  RedisSchema,
} from '../utils/redis/redis-wrapper';

//for typescript
interface ProfileEntity extends IProfile {}

/*
An Entity is the class that holds you data when you work with it.
It is what you create, read, update, and delete.
*/
class ProfileEntity extends RedisEntity {}

/*
schema defines the fields on your entity, their types, and
how they are mapped internally to Redis.
Valid types are: string, number, boolean, string[], date, point, and text.
*/

const schema = new RedisSchema(ProfileEntity, {
  persona: { type: 'string' },
  accessories: { type: 'number' },
  apparel: { type: 'number' },
  'accessories:watches': { type: 'number' },
  'apparel:topwear': { type: 'number' },
  'apparel:bottomwear': { type: 'number' },
  avgCartPrice: { type: 'number' },

  createdOn: { type: 'date' },
  createdBy: { type: 'string' },
  lastUpdatedOn: { type: 'date' },
  lastUpdatedBy: { type: 'string' },
  statusCode: { type: 'number' },
});

/*
 A Repository is the main interface into Redis OM. It gives us the methods to read, write, and remove a specific Entity
 */

const getRepository = () => {
  const redisOmClient = getRedisOmClient();
  return redisOmClient?.fetchRepository(schema);
};

/*
we need to create an index or we won't be able to search.
Redis OM uses hash to see if index needs to be recreated or not
*/

const createRedisIndex = async () => {
  const repository = getRepository();
  if (repository) {
    await repository.createIndex();
  }
};

const default_profiles: IProfile[] = [
  {
    persona: 'GRANDMOTHER',
    accessories: 0,
    apparel: 3,
    'accessories:watches': 0,
    'apparel:topwear': 3,
    'apparel:bottomwear': 0,
    avgCartPrice: 2894,
  },
  {
    persona: 'GRANDFATHER',
    accessories: 2,
    apparel: 1,
    'accessories:watches': 2,
    'apparel:topwear': 1,
    'apparel:bottomwear': 0,
    avgCartPrice: 7990,
  },
  {
    persona: 'MOTHER',
    accessories: 0,
    apparel: 7,
    'accessories:watches': 0,
    'apparel:topwear': 4,
    'apparel:bottomwear': 3,
    avgCartPrice: 4780,
  },
  {
    persona: 'FATHER',
    accessories: 5,
    apparel: 1,
    'accessories:watches': 5,
    'apparel:topwear': 0,
    'apparel:bottomwear': 1,
    avgCartPrice: 11990,
  },
  {
    persona: 'SON',
    accessories: 0,
    apparel: 8,
    'accessories:watches': 0,
    'apparel:topwear': 5,
    'apparel:bottomwear': 3,
    avgCartPrice: 4780,
  },
  {
    persona: 'DAUGHTER',
    accessories: 0,
    apparel: 15,
    'accessories:watches': 0,
    'apparel:topwear': 10,
    'apparel:bottomwear': 5,
    avgCartPrice: 4950,
  },
];

const initialize = async () => {
  await createRedisIndex();

  const repository = getRepository();

  if (!repository) {
    return;
  }

  const exists = await repository
    .search()
    .where('persona')
    .equals('GRANDMOTHER')
    .return.count();

  if (exists && exists > 0) {
    return;
  }

  const nodeRedisClient = getNodeRedisClient();

  default_profiles.forEach(async (profile) => {
    if (profile.accessories > 0) {
      await nodeRedisClient?.bf.add(
        'bfprofile:accessories',
        profile.persona.toLowerCase(),
      );
    }

    if (profile.apparel > 0) {
      await nodeRedisClient?.bf.add(
        'bfprofile:apparel',
        profile.persona.toLowerCase(),
      );
    }

    if (profile['accessories:watches'] > 0) {
      await nodeRedisClient?.bf.add(
        'bfprofile:accessories:watches',
        profile.persona.toLowerCase(),
      );
    }

    if (profile['apparel:topwear'] > 0) {
      await nodeRedisClient?.bf.add(
        'bfprofile:apparel:topwear',
        profile.persona.toLowerCase(),
      );
    }

    if (profile['apparel:bottomwear'] > 0) {
      await nodeRedisClient?.bf.add(
        'bfprofile:apparel:bottomwear',
        profile.persona.toLowerCase(),
      );
    }
  });

  await Promise.all(
    default_profiles.map((profile) => {
      return repository.createAndSave(profile);
    }),
  );
};

export { getRepository, initialize };

export type { ProfileEntity, IProfile };
