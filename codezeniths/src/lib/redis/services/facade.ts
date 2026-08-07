import type { IRedisClient } from '../interfaces';
import { CacheService } from './cache.service';
import { LockService } from './lock.service';
import { RateLimitService } from './ratelimit.service';
import { PubSubService } from './pubsub.service';
import { QueueService } from './queue.service';
import { ListService } from './list.service';
import { SortedListService } from './sorted-list.service';
import { BloomFilterService } from './bloom.service';
import { TrieService } from './trie.service';

export class RedisService {
    public readonly cache: CacheService;
    public readonly lock: LockService;
    public readonly ratelimit: RateLimitService;
    public readonly pubsub: PubSubService;
    public readonly queue: QueueService;
    public readonly list: ListService;
    public readonly sortedList: SortedListService;
    public readonly bloom: BloomFilterService;
    public readonly trie: TrieService;

    constructor(public readonly client: IRedisClient) {
        this.cache = new CacheService(client);
        this.lock = new LockService(client);
        this.ratelimit = new RateLimitService(client);
        this.pubsub = new PubSubService(client);
        this.queue = new QueueService(client);
        this.list = new ListService(client);
        this.sortedList = new SortedListService(client);
        this.bloom = new BloomFilterService(client);
        this.trie = new TrieService(client);
    }
}
