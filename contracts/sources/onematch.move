module onematch::core {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    /// Core application state
    public struct ModuleData has key {
        id: UID,
    }

    fun init(ctx: &mut TxContext) {
        let module_data = ModuleData {
            id: object::new(ctx),
        };
        transfer::share_object(module_data);
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
