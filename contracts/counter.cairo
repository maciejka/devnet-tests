#[starknet::contract]
mod counter {

    #[storage]
    struct Storage {
        counter: u128,
    }

    #[external(v0)]
    #[generate_trait]
    impl ExternalImpl of ExternalTrait {
        fn increment(ref self: ContractState) -> u128 {
            let next = self.counter.read() + 1;
            self.counter.write(next);
            next
        }
        fn get_counter(self: @ContractState) -> u128 {
            self.counter.read()
        }
    }
}
