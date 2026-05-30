drop policy if exists "Users can update own platforms" on public.platforms;
drop policy if exists "Users can update own goals" on public.goals;
drop policy if exists "Users can update own purchases" on public.purchases;

create policy "Users can update own platforms"
on public.platforms for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can update own goals"
on public.goals for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can update own purchases"
on public.purchases for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
