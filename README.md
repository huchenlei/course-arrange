# Course Arrange
Arrange(Schedule) courses with given constraints.

## Components
### `Course.ts`
Defines object models for course.<br>
Each course can have multiple components i.e. Lecture, Tutorial, Lab, etc.<br>
For each component, there are different sections to choose from.<br>
For each section, there are often more than one time slot,
e.g. there are 3 lectures a week for a certain section.

### `Constraint.ts`
Defines common constraints used to evaluate the solution. User can also
extend the base class `Constraint` to have their own constraint definition.

### `Solver.ts`
Core component. Defines the Solver to solve for optimum results. There
are currently two type of solver:
- `ExhaustiveSolver`: Search for every possible solution and choose the
best one. Report failure directly if the possible solution set is too large
- `StepHeuristicSolver`: For each component sequence, advance search step by
step, by choosing the most promising solution(incomplete solution with
highest score), until finding enough solutions.

## Current Issues
- `StepHeuristicSolver` still have implicit bugs
- Need to develop a more efficient solver algorithm
- Need more test-case for the performance and correctness for solvers
---
#### Please contact [me](https://huchenlei.github.io) directly if you would like to be part of this project


