# Outrank V4 - Complete Gameflow Documentation

## Overview
V4 is a push-your-luck trivia game where players draft tokens, guess higher/lower, and collect matching sets for points.

**Core Loop**: Draft → Guess → Collect or Lose → Repeat

---

## Game Setup

### Initial Setup
1. **Player Configuration**
   - Number of players: 2-6
   - Each player starts with:
     - 0 tokens in hand
     - 0 points
     - Empty "this round" collection

2. **Starting Player**
   - Youngest player goes first
   - "First Guesser" marker given to starting player

3. **Token Database**
   - 40 tokens per category (Movies, Countries, Sports, Companies)
   - Each token has 4 tags (A, B, C, D categories)
   - Tags visible around edge of token

---

## Round Structure

### Phase 1: Challenge Selection & Pool Setup

**Starting Player**: Player with "First Guesser" marker

**Actions**:
1. **Select Challenge**
   - Choose from available challenge cards
   - Challenge specifies: Category + Stat (e.g., "Movies - Box Office")

2. **Draw Tokens**
   - Draw 13 tokens from category pool
   - 1 token placed in **center** (revealed)
   - 12 tokens placed in **draft pool** (face-up, visible to all)

3. **Display**
   - Show challenge name and stat
   - Show center token with its value
   - Show all 12 draft pool tokens
   - All information is public

**Special Cases**:
- **First round**: Draw fresh 13 tokens
- **Subsequent rounds**:
  - If pool has < 8 tokens from last round, refill to minimum 8
  - If category exhausted, must choose different category

---

### Phase 2: Draft & Guess Phase

**Turn Order**: Clockwise, starting with "First Guesser"

**On Each Player's Turn, Choose ONE:**

#### Option A: DRAFT & GUESS
1. **Select token** from draft pool
2. **Call "HIGHER" or "LOWER"** compared to center token
3. **Reveal**: Show center token's stat value vs. drafted token's value

**If CORRECT:**
- ✅ **Collect center token** → Add to "this round" pile
- ✅ **Score 1 point** immediately
- **Drafted token becomes new center token**
- **Next player's turn**

**If WRONG:**
- ❌ **Lose ALL tokens** from "this round" pile → Back to center pool
- ❌ **Drafted token** → Back to draft pool
- ✅ **KEEP all points** earned this round
- 📍 **Become "First Guesser"** for next round
- **Next player's turn**

#### Option B: CASH OUT
**Requirements**: Must have at least 2 tokens with matching tag

**Actions**:
1. **Select tokens** to cash (must share at least one tag)
2. **Choose which tag** they're being cashed for (one tag per token)
3. **Score points**:
   - 2 tokens = 2 points
   - 3 tokens = 5 points
   - 4 tokens = 8 points
4. **Retire tokens** permanently from game
5. **Remaining tokens** stay in hand for future rounds
6. **Your turn ends**

**Constraints**:
- Can only cash ONE set per turn
- Each token can only be used for ONE tag
- Must cash on your turn (can't cash between turns)

#### Option C: PASS
- **Stop participating** in this round
- **Tokens in hand** stay in hand (carry to next round)
- **Points earned** this round are safe
- **Cannot take more turns** this round
- **You're out** until next round starts

**Special Cases**:
- **At 8 tokens**: MUST cash out or discard, cannot draft
- **Last player standing**: Can continue drafting solo until pass or fail
- **All players pass**: Round ends immediately

---

### Phase 3: Round End

**Trigger**: All players have passed OR draft pool is empty

**Actions**:
1. **Last Standing Bonus**
   - Last player to pass gets +1 bonus point
   - Even if they only made 1 guess

2. **Token Management**
   - Tokens in "this round" piles → Move to player hands (stay with players)
   - **Tokens still in center/draft pool → STAY IN THEIR CATEGORY POOL** (not returned to master pool)
   - Tokens in player hands → Stay with players
   - Cashed tokens → Retired permanently (never return to any pool)

3. **First Guesser Assignment**
   - Already assigned during play (first to pass/fail)
   - Marker moves to that player

4. **Next Round Setup**
   - First Guesser selects category (can be same or different)
   - First Guesser selects challenge within category
   - Check if category has >= 13 tokens available
   - If yes: Draw 13 tokens (1 center + 12 draft)
   - If no: Force category change ("Category exhausted")
   - New round begins

**Category Pool Tracking**:
- Each category maintains its own pool
- Tokens only leave category pool when: drawn for play, held by players, or cashed out
- Unused tokens at round end STAY in their category pool (Movies, Countries, Sports, etc.)
- Category pools never replenish - tokens are permanently removed when taken

**Example Token Flow**:
```
Start of Game:
- Movies Pool: 40 tokens
- Countries Pool: 40 tokens

Round 1 (Movies - Box Office):
- Draw 13 tokens from Movies Pool
- Movies Pool now: 27 tokens
- Play happens, round ends
- 3 tokens in draft pool + 1 in center = 4 tokens unused
- These 4 tokens STAY in Movies category (not available for next round draw)
- Movies Pool still: 27 tokens (the 4 in-play tokens are "reserved")

Round 2 (First Guesser picks Countries - GDP):
- Draw 13 tokens from Countries Pool
- Countries Pool now: 27 tokens
- Movies Pool still: 27 tokens (unused from Round 1 stay in Movies category)
- The 4 Movies tokens from Round 1 are still "in the game" but in Movies category

Round 3 (First Guesser picks Movies again - Budget):
- Movies Pool: 27 available tokens
- Cannot access the 4 tokens still in play from Round 1
- Draw 13 NEW tokens from the 27 available
- Movies Pool now: 14 tokens available
```

---

## Scoring System

### Points Earned During Play:
- **1 point** per correct higher/lower guess
- **1 bonus point** for last player to pass in round
- **2/5/8 points** for cashing out 2/3/4-token sets

### Turn Order Benefit:
- **First Guesser** for next round (assigned to first pass/fail)

### End Game:
- **Uncashed tokens** = 0 points
- Only cashed sets and guess points count

---

## Hand Management

### Hand Limit: 8 Tokens Maximum

**When at 8 tokens:**
- Cannot draft more tokens
- Must cash out a set OR discard tokens
- Can still pass

**Token Tracking:**
- **"This Round" tokens**: Just collected, at risk if you guess wrong
- **"Hand" tokens**: From previous rounds, safe until cashed/discarded
- **Clear separation** in UI

---

## Game End Conditions

**Game ends when:**
- [TBD - needs playtesting]
- Options: Round limit, score target, token depletion, time limit

**Final Scoring:**
- Add up all points earned during game
- Uncashed tokens worth 0
- Highest score wins

**Tiebreaker:**
1. Most tokens in hand
2. Most correct guesses made
3. Shared victory

---

## State Management

### Core Game State
```javascript
gameState = {
    // Game flow
    phase: 'setup' | 'challenge' | 'drafting' | 'roundEnd' | 'gameEnd',
    round: number,
    currentPlayer: index,
    firstGuesser: index,

    // Players
    players: [{
        name: string,
        score: number,
        hand: [tokens],              // Tokens from previous rounds (safe)
        thisRound: [tokens],         // Tokens collected this round (at risk)
        correctGuesses: number,      // Stats tracking
        cashOuts: number
    }],

    // Challenge
    currentChallenge: {
        category: string,
        stat: string,
        name: string,
        direction: 'higher' | 'lower'
    },

    // Token pools
    centerToken: token,              // Current comparison token
    draftPool: [tokens],             // 12 available to draft
    categoryPools: {
        movies: [tokens],
        countries: [tokens],
        // etc.
    },
    retiredTokens: [tokens],         // Cashed out, removed from game

    // Round tracking
    passedPlayers: Set,              // Who passed this round
    lastToPass: index,               // Tracks for bonus

    // UI state
    selectedTokensForCash: [indices],
    selectedTag: string
}
```

### Key State Transitions
1. **Setup** → **Challenge** (first guesser selects)
2. **Challenge** → **Drafting** (tokens drawn)
3. **Drafting** → **Drafting** (player turn completes)
4. **Drafting** → **RoundEnd** (all passed)
5. **RoundEnd** → **Challenge** (new round starts)
6. **RoundEnd** → **GameEnd** (end condition met)

---

## UI Requirements

### Main Game Screen
- **Challenge Display**: Category + Stat + Direction
- **Center Token**: Large, prominent, with value
- **Draft Pool**: 12 tokens visible, clickable
- **Player Info**: Score, hand size, this-round tokens
- **Current Player**: Highlighted
- **Action Buttons**: Draft & Guess | Cash Out | Pass

### Player Hand View
- **This Round** section (tokens at risk)
- **Hand** section (safe tokens from previous rounds)
- **Color coding** or visual separation
- **Tag indicators** on each token

### Cash Out Interface
- Select tokens from hand
- Show available sets (matching tags highlighted)
- Choose which tag to cash for
- Show point value (2/5/8)
- Confirm button

### Guess Interface
- Selected token from draft pool
- **HIGHER** and **LOWER** buttons (large, prominent)
- Comparison shown: [Drafted Token] vs [Center Token]
- Stat being compared displayed clearly

### Feedback/Animations
- Correct guess: ✅ Green, +1 point animation
- Wrong guess: ❌ Red, tokens return animation
- Last standing: 🎉 +1 bonus point
- Cash out: 💰 Points added, tokens retired
- First guesser: 📍 Marker moves

---

## Example Round Flow

**Setup:**
- Challenge: "Movies - Box Office Revenue"
- Center: Avatar ($2.9B)
- Draft Pool: 12 movies visible

**Turn 1 (Alice - First Guesser):**
- Drafts "Titanic"
- Guesses: "LOWER"
- Correct! (Titanic $2.2B < Avatar $2.9B)
- Alice: +1 point, collects Avatar
- Titanic becomes center token

**Turn 2 (Bob):**
- Drafts "Avengers: Endgame"
- Guesses: "HIGHER"
- Correct! (Endgame $2.8B > Titanic $2.2B)
- Bob: +1 point, collects Titanic
- Endgame becomes center token

**Turn 3 (Alice again):**
- Drafts "John Carter"
- Guesses: "HIGHER"
- WRONG! (John Carter $284M < Endgame $2.8B)
- Alice: Loses Avatar (back to pool), keeps her +1 point from Turn 1
- Alice becomes First Guesser next round
- John Carter returns to draft pool

**Turn 4 (Bob):**
- Passes (wants to keep Titanic safe)

**Turn 5 (Alice is out):**

**Round End:**
- Bob was last to pass → +1 bonus point
- Bob moves Titanic to hand (safe now)
- Alice becomes First Guesser next round

---

## Design Notes

### Why This Works:
- **Points are safe, tokens are at risk** = Encourages bold play
- **First guesser advantage** = Consolation for losing/passing early
- **Last standing bonus** = Tension to stay in
- **Hand limit** = Forces periodic cashing decisions
- **Multiple scoring paths** = Viable strategies (guessing vs. collecting)

### Balance Considerations:
- Guess points (1pt each) vs Set points (2/5/8) needs playtesting
- First guesser advantage strength TBD
- Hand limit (8) may need adjustment
- Game length/end condition critical

### Playtesting Focus:
1. Is guessing for points more optimal than set collecting?
2. Is first guesser advantage too strong?
3. Do rounds end too quickly or drag?
4. Is 8-token hand limit right?
5. What's the right game end condition?
