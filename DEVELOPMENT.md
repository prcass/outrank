# Development Partnership

We're building production-quality code together. Your role is to create maintainable, efficient solutions while catching potential issues early.

When you seem stuck or overly complex, I'll redirect you - my guidance helps you stay on track.

## 🚨 VALIDATION CHECKS ARE MANDATORY
**ALL errors must be fixed - EVERYTHING must be ✅ GREEN!**  
No console errors. No broken features. No inconsistent game state.  
These are not suggestions. Fix ALL issues before continuing.

## CRITICAL WORKFLOW - ALWAYS FOLLOW THIS!

### Research → Plan → Implement
**NEVER JUMP STRAIGHT TO CODING!** Always follow this sequence:
1. **Research**: Explore the codebase, understand existing patterns
2. **Plan**: Create a detailed implementation plan and verify it with me  
3. **Implement**: Execute the plan with validation checkpoints

When asked to implement any feature, you'll first say: "Let me research the codebase and create a plan before implementing."

For complex architectural decisions or challenging problems, use **"ultrathink"** to engage maximum reasoning capacity. Say: "Let me ultrathink about this architecture before proposing a solution."

### USE MULTIPLE AGENTS!
*Leverage subagents aggressively* for better results:

* Spawn agents to explore different parts of the codebase in parallel
* Use one agent to test features while another implements them
* Delegate research tasks: "I'll have an agent investigate the scoring system while I analyze the UI structure"
* For complex refactors: One agent identifies changes, another implements them

Say: "I'll spawn agents to tackle different aspects of this problem" whenever a task has multiple independent parts.

### Reality Checkpoints
**Stop and validate** at these moments:
- After implementing a complete feature
- Before starting a new major component  
- When something feels wrong
- Before declaring "done"
- **WHEN BROWSER CONSOLE SHOWS ERRORS** ❌

Run: 
- Refresh the browser
- Check console for errors
- Test the feature manually
- Run automated test if applicable

> Why: You can lose track of what's actually working. These checkpoints prevent cascading failures.

### 🚨 CRITICAL: Browser Errors Are BLOCKING
**When console shows ANY errors, you MUST:**
1. **STOP IMMEDIATELY** - Do not continue with other tasks
2. **FIX ALL ISSUES** - Address every ❌ error until console is clean
3. **VERIFY THE FIX** - Refresh and confirm no errors remain
4. **TEST THE FEATURE** - Ensure the fix didn't break functionality
5. **CONTINUE ORIGINAL TASK** - Return to what you were doing before
6. **NEVER IGNORE** - There are NO acceptable console errors

This includes:
- JavaScript errors (undefined variables, null references)
- Failed network requests (404s, failed fetches)
- DOM manipulation errors
- Game state inconsistencies

Your code must run cleanly. No exceptions.

**Recovery Protocol:**
- When interrupted by an error, maintain awareness of your original task
- After fixing all issues and verifying, continue where you left off
- Use the TodoWrite tool to track both the fix and your original task

## Working Memory Management

### When context gets long:
- Re-read CLAUDE.md and this file
- Summarize progress in comments
- Document current state before major changes

### Use TodoWrite/TodoRead tools:
```
## Current Task
- [ ] What we're doing RIGHT NOW

## Completed  
- [x] What's actually done and tested

## Next Steps
- [ ] What comes next
```

## JavaScript-Specific Rules

### FORBIDDEN - NEVER DO THESE:
- **NO eval()** or **new Function()** - security risk!
- **NO var** when const/let would work - use block scoping!
- **NO inline styles** when CSS classes exist - maintain separation!
- **NO direct innerHTML** with user data - XSS vulnerability!
- **NO global variables** without window prefix - avoid namespace pollution!
- **NO console.log** in final code - clean up debugging statements!
- **NO == comparisons** - use === for type safety!

### Required Standards:
- **Delete** old code when replacing it
- **Meaningful names**: `playerScore` not `score`
- **Early returns** to reduce nesting
- **Consistent patterns**: Follow existing UI update patterns
- **Error handling**: Try-catch for external data/user input
- **Clean console**: No errors or leftover debug logs

## Implementation Standards

### Our code is complete when:
- ✓ No console errors
- ✓ Feature works end-to-end
- ✓ Old code is deleted
- ✓ Follows existing patterns
- ✓ Manual testing passes
- ✓ Game state remains consistent

### Testing Strategy
- Complex game logic → Test with automated test system
- UI interactions → Manual testing with multiple scenarios
- Edge cases → Test boundary conditions (0 players, max cards, etc.)
- State consistency → Verify token counts, scores, card pools

### Code Organization
```
game.js structure:
- Configuration objects (GAME_CONFIG, ACTIVE_RULES)
- State management (players object)
- Core game functions
- UI update functions
- Event handlers
- Utility functions
```

## Problem-Solving Together

When you're stuck or confused:
1. **Stop** - Don't spiral into complex solutions
2. **Delegate** - Consider spawning agents for parallel investigation
3. **Ultrathink** - For complex problems, say "I need to ultrathink through this challenge"
4. **Step back** - Re-read the requirements
5. **Simplify** - The simple solution is usually correct
6. **Ask** - "I see two approaches: [A] vs [B]. Which do you prefer?"

My insights on better approaches are valued - please ask for them!

## Browser Development Best Practices

### **Debug First**:
- Use browser DevTools extensively
- Set breakpoints instead of console.log debugging
- Check Network tab for failed requests
- Use Elements tab to verify DOM updates

### **Performance Considerations**:
- Minimize DOM manipulations
- Use getElementById over querySelector when possible
- Batch UI updates together
- Avoid creating elements in loops

### **Security Always**:
- Sanitize any user input
- Use textContent over innerHTML for user data
- Validate all inputs before processing
- Never trust data from external sources

## Communication Protocol

### Progress Updates:
```
✓ Implemented card statistics tracking (no console errors)
✓ Added notification system for card changes
✗ Found issue with token counting - investigating
```

### Suggesting Improvements:
"The current approach works, but I notice [observation].
Would you like me to [specific improvement]?"

## Working Together

- This is a living codebase - maintain backward compatibility for saved games
- When in doubt, we choose clarity over cleverness
- Test with both Chrome and Firefox when possible
- Mobile-first design - all features must work on phone-sized screens
- **REMINDER**: If this file hasn't been referenced in 30+ minutes, RE-READ IT!

## Know-It-All Specific Guidelines

### Game State Integrity:
- Token counts must always sum correctly across players
- Card pools must never contain duplicates
- Scores must be accurately calculated
- Owned cards must persist properly between rounds

### UI Consistency:
- All screens follow the same header/content pattern
- Buttons use consistent styling (primary/secondary)
- Animations and transitions should be smooth
- Error states should be clearly communicated

### Feature Implementation Checklist:
- [ ] Research existing patterns in codebase
- [ ] Plan implementation approach
- [ ] Implement with incremental testing
- [ ] Verify no console errors
- [ ] Test all edge cases
- [ ] Clean up any debug code
- [ ] Update CLAUDE.md if adding major features

Avoid complex abstractions or "clever" code. The simple, obvious solution that follows existing patterns is probably better, and my guidance helps you stay focused on what matters.