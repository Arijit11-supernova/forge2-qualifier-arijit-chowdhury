<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index() { return Card::with(['list', 'tags', 'members'])->get(); }
    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'position' => 'integer',
            'list_id' => 'required|integer',
            'due_date' => 'nullable|date',
        ]);
        return Card::create($validated);
    }
    public function show(Card $card) {
        $card->append('is_overdue');
        return $card->load(['list', 'tags', 'members']);
    }
    public function update(Request $request, Card $card) {
        $card->update($request->all());
        return $card;
    }
    public function destroy(Card $card) {
        $card->delete();
        return response()->json(null, 204);
    }

    public function move(Request $request, Card $card) {
        $request->validate(['list_id' => 'required|integer']);
        $card->update(['list_id' => $request->list_id]);
        return response()->json(['message' => 'Card moved successfully', 'card' => $card]);
    }

    public function attachTag(Request $request, Card $card) {
        $request->validate(['tag_id' => 'required|integer']);
        $card->tags()->attach($request->tag_id);
        return response()->json(['message' => 'Tag attached']);
    }

    public function detachTag(Request $request, Card $card) {
        $request->validate(['tag_id' => 'required|integer']);
        $card->tags()->detach($request->tag_id);
        return response()->json(['message' => 'Tag detached']);
    }

    public function assignMember(Request $request, Card $card) {
        $request->validate(['member_id' => 'required|integer']);
        $card->members()->attach($request->member_id);
        return response()->json(['message' => 'Member assigned']);
    }

    public function unassignMember(Request $request, Card $card) {
        $request->validate(['member_id' => 'required|integer']);
        $card->members()->detach($request->member_id);
        return response()->json(['message' => 'Member unassigned']);
    }
}
