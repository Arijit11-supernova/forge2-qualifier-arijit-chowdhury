<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index() { return Board::all(); }
    public function store(Request $request) {
        $validated = $request->validate(['name' => 'required|string', 'description' => 'nullable|string']);
        return Board::create($validated);
    }
    public function show(Board $board) { return $board; }
    public function update(Request $request, Board $board) {
        $board->update($request->all());
        return $board;
    }
    public function destroy(Board $board) {
        $board->delete();
        return response()->json(null, 204);
    }
}
