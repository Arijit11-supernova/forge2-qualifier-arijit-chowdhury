<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Carbon\Carbon;

class Card extends Model
{
    protected $fillable = ['title', 'description', 'position', 'list_id', 'due_date'];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    public function list(): BelongsTo
    {
        return $this->belongsTo(KanbanList::class, 'list_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Member::class);
    }

    public function getIsOverdueAttribute()
    {
        if (!$this->due_date) {
            return false;
        }

        // Consider "Done" list logic: if the associated list name is 'Done' (case-insensitive)
        $list = $this->list;
        if ($list && strtolower($list->name) === 'done') {
            return false;
        }

        return $this->due_date->isPast();
    }
}
