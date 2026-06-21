<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KanbanList;
use Illuminate\Http\Request;

class KanbanListController extends Controller
{
    public function index() { return KanbanList::all(); }
    public function store(Request $request) {
        $validated = $request->validate(['board_id' => 'required|integer', 'name' => 'required|string', 'position' => 'integer']);
        return KanbanList::create($validated);
    }
    public function show(KanbanList $kanbanList) { return $kanbanList; }
    public function update(Request $request, KanbanList $kanbanList) {
        $kanbanList->update($request->all());
        return $kanbanList;
    }
    public function destroy(KanbanList $kanbanList) {
        $kanbanList->delete();
        return response()->json(null, 204);
    }
}
