# Development Standards & Protocols

## 🚨 MANDATORY VALIDATION
**ALL errors must be fixed - EVERYTHING must be ✅ GREEN!**
- No console errors
- No broken features  
- No inconsistent game state
These are not suggestions. Fix ALL issues before continuing.

## Critical Workflow

### Always Follow: Research → Plan → Implement
**NEVER JUMP STRAIGHT TO CODING!**
1. **Research**: Explore codebase, understand existing patterns
2. **Plan**: Create detailed implementation plan
3. **Implement**: Execute with validation checkpoints

### Use Multiple Agents Aggressively
- Spawn agents to explore different parts of codebase in parallel
- One agent tests while another implements
- Delegate research tasks for complex features
- For refactors: One agent identifies changes, another implements

### Reality Checkpoints - STOP and validate:
- After implementing complete features
- Before starting major components
- When something feels wrong
- Before declaring "done"
- **WHEN BROWSER CONSOLE SHOWS ERRORS** ❌

## 🚨 CRITICAL: Browser Errors Are BLOCKING
**When console shows ANY errors:**
1. **STOP IMMEDIATELY** - Do not continue
2. **FIX ALL ISSUES** - Address every ❌ error
3. **VERIFY THE FIX** - Refresh and confirm clean console
4. **TEST THE FEATURE** - Ensure fix didn't break functionality
5. **CONTINUE ORIGINAL TASK** - Return to previous work

No exceptions. Your code must run cleanly.

## JavaScript Standards

### FORBIDDEN - NEVER DO:
- **NO eval()** or **new Function()** - security risk
- **NO var** when const/let work - use block scoping
- **NO inline styles** when CSS classes exist
- **NO direct innerHTML** with user data - XSS vulnerability
- **NO global variables** without window prefix
- **NO console.log** in final code - clean up debugging
- **NO == comparisons** - use === for type safety

### Required Standards:
- **Delete** old code when replacing it
- **Meaningful names**: `playerScore` not `score`
- **Early returns** to reduce nesting
- **Consistent patterns**: Follow existing UI patterns
- **Error handling**: Try-catch for external data/user input
- **Clean console**: No errors or leftover debug logs

## Know-It-All Specific Rules

### Game State Integrity:
- Token counts must always sum correctly across players
- Card pools must never contain duplicates
- Scores must be accurately calculated
- Owned cards must persist properly between rounds

### UI Consistency:
- All screens follow header/content pattern
- Buttons use consistent styling (primary/secondary)
- Animations should be smooth
- Error states clearly communicated

### Testing Protocol:
- Complex game logic → Use automated test system
- UI interactions → Manual testing with multiple scenarios
- Edge cases → Test boundary conditions
- State consistency → Verify token counts, scores, card pools

## Code Organization Pattern
```
game.js structure:
- Configuration objects (GAME_CONFIG, ACTIVE_RULES)
- State management (players object)
- Core game functions
- UI update functions
- Event handlers
- Utility functions
```

## Problem-Solving Protocol
When stuck:
1. **Stop** - Don't spiral into complex solutions
2. **Delegate** - Spawn agents for parallel investigation
3. **Simplify** - Simple solution is usually correct
4. **Ask** - "I see approaches [A] vs [B]. Which do you prefer?"

## Performance & Security
- Minimize DOM manipulations
- Use getElementById over querySelector when possible
- Sanitize any user input
- Use textContent over innerHTML for user data
- Validate all inputs before processing

## Implementation Checklist
- [ ] Research existing patterns in codebase
- [ ] Plan implementation approach
- [ ] Implement with incremental testing
- [ ] Verify no console errors
- [ ] Test all edge cases
- [ ] Clean up debug code
- [ ] **Update CLAUDE.md** if adding major features/mechanics
- [ ] **Update COMMANDS.md** if new tools/workflows added
- [ ] **Update DEVELOPMENT.md** if new standards/patterns emerge