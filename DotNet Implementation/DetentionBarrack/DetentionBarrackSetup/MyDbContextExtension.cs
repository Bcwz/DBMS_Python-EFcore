using DetentionBarrackSetup.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack.Setup
{
    public static class MyDbContextExtension
    {
        public static void Seed(this MyDbContext context)
        {
            // shady way to flush db data then add seed data
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();


            OperationState onlineOpState = new OperationState
            {
                OperationStateId = 1,
                DisplayValue = "Online"
            };

            OperationState offlineOpState = new OperationState
            {
                OperationStateId = 2,
                DisplayValue = "Offline"
            };

            context.OperationStates.AddRange(onlineOpState, offlineOpState);
            context.SaveChanges();
        }
    }
}
