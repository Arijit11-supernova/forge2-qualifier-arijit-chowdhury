<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index() { return Member::all(); }
    public function store(Request $request) {
        $validated = $request->validate(['name' => 'required|string', 'email' => 'required|email']);
        return Member::create($validated);
    }
    public function show(Member $member) { return $member; }
    public function update(Request $request, Member $member) {
        $member->update($request->all());
        return $member;
    }
    public function destroy(Member $member) {
        $member->delete();
        return response()->json(null, 204);
    }
}
