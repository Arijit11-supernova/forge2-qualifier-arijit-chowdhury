<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Tags
        DB::table('tags')->insertOrIgnore([
            ['id' => 1, 'name' => 'Urgent', 'color' => '#FF0000', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Design', 'color' => '#0000FF', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Bug', 'color' => '#00FF00', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Create Members
        DB::table('members')->insertOrIgnore([
            ['id' => 1, 'name' => 'Arijit', 'email' => 'arijit@example.com', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Rahul', 'email' => 'rahul@example.com', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Priya', 'email' => 'priya@example.com', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Create Board
        DB::table('boards')->insertOrIgnore([
            ['id' => 1, 'name' => 'Main Board', 'description' => 'Forge 2 Qualifier Kanban', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Create Lists
        DB::table('kanban_lists')->insertOrIgnore([
            ['id' => 1, 'board_id' => 1, 'name' => 'To Do', 'position' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'board_id' => 1, 'name' => 'In Progress', 'position' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'board_id' => 1, 'name' => 'Done', 'position' => 2, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Create Cards
        DB::table('cards')->insertOrIgnore([
            ['id' => 1, 'list_id' => 1, 'title' => 'Design Login Page', 'description' => 'Create UI mockups', 'position' => 0, 'due_date' => '2026-06-20', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'list_id' => 2, 'title' => 'Build API', 'description' => 'Laravel REST API', 'position' => 0, 'due_date' => '2026-06-21', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'list_id' => 3, 'title' => 'Setup Database', 'description' => 'SQLite migrations', 'position' => 0, 'due_date' => '2026-06-19', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Attach Tags to Cards
        DB::table('card_tag')->insertOrIgnore([
            ['card_id' => 1, 'tag_id' => 1],
            ['card_id' => 2, 'tag_id' => 2],
        ]);

        // Assign Members to Cards
        DB::table('card_member')->insertOrIgnore([
            ['card_id' => 1, 'member_id' => 1],
            ['card_id' => 2, 'member_id' => 2],
        ]);
    }
}
