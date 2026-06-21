<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\KanbanListController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\MemberController;

Route::apiResource('boards', BoardController::class);
Route::apiResource('lists', KanbanListController::class);
Route::apiResource('tags', TagController::class);
Route::apiResource('members', MemberController::class);
Route::apiResource('cards', CardController::class);

Route::patch('cards/{card}/move', [CardController::class, 'move']);
Route::post('cards/{card}/tags', [CardController::class, 'attachTag']);
Route::delete('cards/{card}/tags', [CardController::class, 'detachTag']);
Route::post('cards/{card}/members', [CardController::class, 'assignMember']);
Route::delete('cards/{card}/members', [CardController::class, 'unassignMember']);
