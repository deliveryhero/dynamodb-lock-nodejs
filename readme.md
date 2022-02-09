## DynamoDB Lock Client for Nodejs

### Introduction

Distributed lock client written in Node.js & Typescript for DynamoDB. Implementation is following (not strictly) [DynamoDB Lock Client for Java](https://github.com/awslabs/amazon-dynamodb-lock-client). Session monitoring is not included. 

There is a `trustLocalTime` option to improve the performance. If `lastUpdatedTimeInMs` is in the past including `leaseDurationInMs` for a lock, the lock can be acquired immediately instead of waiting another `leaseDurationInMs` but the tradeoff is [`clock skew`](https://en.wikipedia.org/wiki/Clock_skew).

It is currently used by two teams in [Delivery Hero](https://www.deliveryhero.com/) for database migrations and high-frequency distributed scheduler. In peak load, ~130 pods are racing through each other to retrieve an exclusive lock every second.   

### Install

```bash
yarn add @deliveryhero/dynamodb-lock
npm install @deliveryhero/dynamodb-lock
```
### Usage

```typescript
import {DynamoDBLockClientFactory} from "@deliveryhero/dynamodb-lock";

// Get lock client from factory
const lockClient = DynamoDBLockClientFactory(documentClient);
// Create a lock
const lock = await lockClient.lock(lockGroup, lockId, {
    leaseDurationInMs: 500,
    prolongLeaseEnabled: false
});
// Release a lock
await lockClient.releaseLock(lock);
// Release all locks created by this process (Graceful shutdown)
await lockClient.releaseAllLocks();
```

### Options

#### Lock Options
* `leaseDurationInMs`, default is 20 seconds
* `prolongLeaseEnabled`, default is true. If disabled, you can hold the lock at most `leaseDurationInMs` then any other request can acquire the lock for given key.
* `prolongEveryMs`, default is 5 seconds. Existing lock is to be renewed with this interval.
* `trustLocalTime`, default is false. If requested lock is already acquired and valid, either wait for leaseDuration to acquire the lock or check stored time value and determined if the leaseDuration is already passed since the last update.
* `waitDurationInMs`, required when trustLocalTime is set to true, wait duration for checking the existing lock again otherwise waitDuration is equal to existing lock's lease duration.  
* `maxRetryCount`, optional. If a requested lock is already acquired and valid, client will try to acquire the lock as long as this times. 
* `additionalAttributes`, any other fields/attributes you want to be stored alongside with the related lock entry in the lock table.

#### Lock table options
* `tableName`: default is `lockTable`
* `partitionKey`: default is `lockId`
* `sortKey`: default is `lockGroup`
* `ttlKey`: optional (recommended, if a lock is not released properly, it ends up staying in DynamoDB lock table, until acquired again.)
* `ttlInMs`: optional, default is one hour

### Tests

* Unit tests could be executed standalone with `yarn test:unit` but e2e tests need DynamoDB which is provided by respective DynamoDB image.
* `docker-compose run --rm -e LOCAL_USER_ID=$UID log_vendor_npm_dynamodb_lock yarn test`

### Development

This project uses `yarn` and internal Delivery Hero drone pipeline to publish new versions based on the release tags. 

### Useful Links

- https://github.com/awslabs/amazon-dynamodb-lock-client
- https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html

